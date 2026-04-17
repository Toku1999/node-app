pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        IMAGE_NAME = "tokesh070/node-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = "node-app"

        SONAR_TOKEN = credentials('SonarQube')
        MONGO_URI = credentials('mongo-uri')
        EC2_IP = "13.222.139.126"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Toku1999/node-app.git'
            }
        }

        stage('Build - Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh """
                    npx sonar-scanner \
                    -Dsonar.projectKey=node-app \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://13.222.139.126:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                docker push $IMAGE_NAME:$IMAGE_TAG
                docker tag $IMAGE_NAME:$IMAGE_TAG $IMAGE_NAME:latest
                docker push $IMAGE_NAME:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP << EOF
                    docker pull $IMAGE_NAME:$IMAGE_TAG
                    docker rm -f $CONTAINER_NAME || true
                    docker run -d -p 4000:4000 \\
                    -e MONGO_URI="$MONGO_URI" \\
                    --name $CONTAINER_NAME $IMAGE_NAME:$IMAGE_TAG
                    EOF
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful! Version: ${IMAGE_TAG}"
        }
        failure {
            echo "❌ Pipeline failed! Check logs."
        }
    }
}

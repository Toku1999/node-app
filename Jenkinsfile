pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        IMAGE_NAME = "tokesh070/node-app"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "node-app"

        SONAR_TOKEN = credentials('SonarQube')
        MONGO_URI = credentials('mongo-uri')
        EC2_IP = "13.220.87.46"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Toku1999/node-app.git'
            }
        }

        stage('Build') {
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
                    sh '''
                    npx sonar-scanner \
                    -Dsonar.projectKey=node-app \
                    -Dsonar.sources=. \
                    -Dsonar.exclusions=node_modules/** \
                    -Dsonar.host.url=http://13.220.87.46:9000 \
                    -Dsonar.token=$SONAR_TOKEN
                    '''
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

        stage('deploy') {
            steps{
                sh '''
                echo "Deploying to Kubernetes..."
                kubectl set image deployment/node-app node-app=$IMAGE_NAME:$IMAGE_TAG
                kubectl rollout status deployment/node-app
                '''
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
        always {
            sh 'docker system prune -af || true'
            cleanWs()
        }
    }
}

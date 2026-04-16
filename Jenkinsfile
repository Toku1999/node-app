pipeline {
    agent any

    tools {
        nodejs 'nodejs'
    }

    environment {
        DOCKER_IMAGE = "tokesh070/node-app"
        DOCKER_TAG = "latest"
        EC2_IP = "YOUR_EC2_IP"
        SONAR_TOKEN = credentials('sonar-token')
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/Toku1999/node-app.git'
            }
        }

        stage('Install') {
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
                    -Dsonar.host.url=http://YOUR_SONAR_IP:9000 \
                    -Dsonar.login=$SONAR_TOKEN
                    """
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
            }
        }

        stage('Login DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['ec2-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP << EOF
                    docker pull $DOCKER_IMAGE:$DOCKER_TAG
                    docker stop node-app || true
                    docker rm node-app || true
                    docker run -d -p 4000:4000 \
                    -e MONGO_URI="your-mongodb-uri" \
                    --name node-app $DOCKER_IMAGE:$DOCKER_TAG
                    EOF
                    """
                }
            }
        }
    }
}

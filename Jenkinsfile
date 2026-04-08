pipeline {
    agent any

    environment {
        IMAGE_NAME = "node-app"
        DOCKERHUB_REPO = "tokesh070/node-app"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Toku1999/node-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:${BUILD_NUMBER} .'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin
                    '''
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh '''
                docker tag $IMAGE_NAME:${BUILD_NUMBER} $DOCKERHUB_REPO:${BUILD_NUMBER}
                docker tag $IMAGE_NAME:${BUILD_NUMBER} $DOCKERHUB_REPO:latest

                docker push $DOCKERHUB_REPO:${BUILD_NUMBER}
                docker push $DOCKERHUB_REPO:latest
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f node-container || true
                docker pull $DOCKERHUB_REPO:${BUILD_NUMBER}
                docker run -d -p 4000:4000 \
                --name node-container \
                --restart always \
                $DOCKERHUB_REPO:${BUILD_NUMBER}
                '''
            }
        }
    }
}}

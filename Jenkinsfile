pipeline {
    agent any

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/YOUR-USERNAME/node-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t node-app .'
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker rm -f node-container || true
                docker run -d -p 4000:4000 --name node-container node-app
                '''
            }
        }
    }
}

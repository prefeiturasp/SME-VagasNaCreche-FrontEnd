pipeline {
    agent {
      node { 
        label 'sme-nodes10'
	    }
    }
    
    options {
      buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
      disableConcurrentBuilds()
      skipDefaultCheckout()  
    }
           
    stages {
        

       stage('CheckOut') {
        steps {
          checkout scm	
        }
       }
      
       stage('Analise codigo') {
          when {
              branch 'homolog'
            }
            steps {
                sh 'sonar-scanner \
                    -Dsonar.projectKey=SME-VagasNaCreche-FrontEnd \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://sonar.sme.prefeitura.sp.gov.br \
                    -Dsonar.login=298987d462b7c54aac3fa48ced6fbeeaac8129e0'
            }
        }
      
       stage('Build Docker DEV') {
         when {
           branch 'dev'
         }
        steps {
          sh 'echo build docker image desenvolvimento'
          
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "15e5a89c-254f-4b71-bd5b-519f991241ee",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
           }
        }
       }        
       
       stage('Deploy DEV') {
         when {
           branch 'dev'
         }
        steps {
       
       
            
          sh 'echo Deploy ambiente desenvolvimento'
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "185118c0-26c6-4fe3-b0d8-6f9c85a6f089",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        } 
       }
       
        
          
        stage('Build Docker HOM') {
         when {
           branch 'homolog'
         }
        steps {  
           
         
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "e7024ef9-20c1-4dcb-b083-7ce01109145b",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
       }

       stage('Deploy HOM') {
         when {
           branch 'homolog'
         }
        steps {
          timeout(time: 24, unit: "HOURS") {
          // telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
            input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'ollyver_ottoboni, kelwy_oliveira, pedro_walter'
          }
         sh 'echo Deploying ambiente homologacao'
                
          
      
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                             
              //JOB DE BUILD
              jobId: "d9b38d7a-f742-4091-bcac-e90aa1e4287f",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
       }

        
        stage('Build Docker PROD') {
         when {
           branch 'master'
         }
        steps {
        
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
              jobId: "3ef72f20-47c1-4903-9778-5453349ad35a",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
              //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
       }

       stage('Deploy PROD') {
         when {
           branch 'master'
         }
        steps {
          timeout(time: 24, unit: "HOURS") {
          // telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Requer uma aprovação para deploy !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n")
            input message: 'Deseja realizar o deploy?', ok: 'SIM', submitter: 'ollyver_ottoboni, kelwy_oliveira, pedro_walter'
          }
            sh 'echo Build image docker Produção'
          
      
          script {
            step([$class: "RundeckNotifier",
              includeRundeckLogs: true,
                             
              //JOB DE DEPLOY
              jobId: "a9bcd05c-d3a7-445a-9e76-41c08a7f7de2",
              nodeFilters: "",
              //options: """
              //     PARAM_1=value1
               //    PARAM_2=value2
              //     PARAM_3=
              //     """,
              rundeckInstance: "Rundeck-SME",
              shouldFailTheBuild: true,
              shouldWaitForRundeckJob: true,
              tags: "",
              tailLog: true])
          }
        }
       }
    } 
  	   
  
}

// DESENVOLVIDO PARA SME - Secretaria Municipal de Educação de SP
// Empresa: AMcom Sistemas
// criado por: Eduardo Bufaino
// e-mail: eduardo.bufaino@amcom.com.br // eduardo.bufaino@gmail.com
// Data: 16/01/2020


pipeline {
    agent {
      node {
        label 'dockernodes8x'
        
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
              -Dsonar.login=08ebd30e25c12731276cbdd25a9e81268d73019c'
       }
      }
     
      
      stage('Deploy DEV') {
        when {
          branch 'dev'
        }      
        steps {
          
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
}

post {
        always {
            
            echo 'One way or another, I have finished'
            
            
        }
        success {
           
            telegramSend("${JOB_NAME}...O Build ${BUILD_DISPLAY_NAME} - Esta ok !!!\n Consulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)\n\n Uma nova versão da aplicação esta disponivel!!!")
        }
        unstable {
          
            telegramSend("O Build ${BUILD_DISPLAY_NAME} <${env.BUILD_URL}> - Esta instavel ...\nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
        failure {
            
             telegramSend("O Build ${BUILD_DISPLAY_NAME} <${env.BUILD_URL}> - Quebrou. \nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
        changed {
            
               echo 'Things were different before...'
            
        }
       aborted {
            
             telegramSend("O Build ${BUILD_DISPLAY_NAME} - Foi abortado.\nConsulte o log para detalhes -> [Job logs](${env.BUILD_URL}console)")
        }
    }

}

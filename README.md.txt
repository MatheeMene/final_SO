# Implementação de um balancer para clusters

### Libs utiliazadas
#
  | Lib | Install |
  | ------ | ------ |
  | Axios | npm i axios |
  | Express | npm i express |
  | Readline | npm i readline |

### A ideia
A partir de um Docker com uma imagem ARCH Linux juntamente com Node instalado, e uma ferramenta de diagnóstico de rede, foi estabelecido um container 'Master' que observa todos os outros nodos filhos que estiverem mapeados para ele.
A comunicação se da através de uma porta IP a qual o nodo filho informa ao container Master. O mesmo irá repetidamente observar caso alguma atividade seja realizada no nodo que está sendo observado.
Com a comunicação estabelecida, a ideia é aumentar o uso da CPU de alguns dos nodos filhos mandando-os resolver o algoritmo de Fibonacci, a partir disso, pegar o uso da CPU de cada NODO, informar ao container Master, para ele observar o uso da indivudual dos NODOS e distribuir a atividade para o que tiver mais processamento disponivel.

### O começo

Primeiro passo para começar o desenvolvimento é instalar o Docker e configurar uma imagem Linux com Node instalado, liberando uma porta para ser escutada.
Nodos filhos são configurados para ouvir uma porta diferente da do Nodo Mestre, mas informam seu endereço IP, uso de CPU e um status. Esse nodos são 'levantados' manualmente, para que a partir dos nodos existentes, o nodo Mestre tenha mapeado os outros ativos e assim possa distribuir o processamento para os nodos com menos uso de CPU.

### A implementação em código

A linguagem utilizada foi Javascript, usando de um servidor Node no qual foram aplicados conceitos de API's REST, multithreading, Webhooks.  

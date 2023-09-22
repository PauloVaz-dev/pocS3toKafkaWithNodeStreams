# Descrição:

Projeto destinado a fazer download de um arquivo no s3 e publicar no kafka usando node Streams e async generator.

## 1 - Existe um docker-compose para subir o kafka e o S3, vc pode ver os tópicos pelo control-center na porta 9021 pela url http://127.0.0.1:9021

#### Criar as credenciais, é fundamental criar as crendenciais localmente ou vai ter erro de permissão no S3
```bash
aws configure --profile default
AWS Access Key ID [****************ocal]: local
AWS Secret Access Key [****************ocal]: locallocal
```

#### Rodar o container
```bash
cd docker
~/.docker/cli-plugins/docker-compose up
```

### Validar se todos os containers subiu
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```


#### Criar o bucket
```bash
aws --endpoint-url=http://127.0.0.1:9000 s3api create-bucket --bucket my-bucket
```

#### Copiar arquivo para o buket
```bash
aws --endpoint-url=http://127.0.0.1:9000 s3 cp file5M.csv s3://my-bucket/
```

#### Rodar o script
```bash
$npx ts-node index.ts
```




# 


#### Certificar que o carquivo foi gerando com a quantidade de linhas
```bash
wl -l sms.csv
```

### Para ver o uso de memória

1 - Instale o climem com dev

$npm i climem -D

#### Rode o projeto passando essas variáveis
CLIMEM=8000 npx ts-node-dev -r climem  knexv4.ts

#### Em outro terminal rode
npx climem 8000





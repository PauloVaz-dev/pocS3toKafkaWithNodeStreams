
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { pipeline, Readable } from 'stream'
import { promisify } from 'util';
import csv from 'csv-parser';
import { Kafka } from 'kafkajs'

// Defining pipelineAsync method
const pipelineAsync = promisify(pipeline);

let records = 0
let fileLength = 0
const kafka = new Kafka({
  brokers: ['127.0.0.1:9091']
})
const producer = kafka.producer();

async function initKafka() {
  console.log('connection kafka')
  await producer.connect()
  console.log('kafka conected')
}

async function stopKafka() {
  console.log('connection kafka')
  await producer.disconnect()
  console.log('kafka conected')
}


const clientS3 = new S3Client({
  forcePathStyle: true,
  endpoint: 'http://127.0.0.1:9000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'locallocal'
  },
  region: 'sa-east-1'
});

async function* download() {
  const { Body } = await clientS3.send(new GetObjectCommand({ Bucket: 'my-bucket', Key: 'file5M.csv' }))
  const stream = Body as Readable;
  for await (const line of stream) {
    fileLength += line.toString().length
    yield line
  }
};

async function* transform(streams: any) {
  for await (const chunk of streams) {
    //console.log(chunk.toString())
    if (chunk.CPF, chunk.detalhes) {
      const campanha = {
        cpf: chunk.CPF.replace(/["]/g, '').trim(),
        detalhes: chunk.detalhes,
        data_de_inclusao: new Date().toISOString(),
      };
      records++
      //console.log('>>>>>>>', JSON.stringify(campanha), count)
      const data = await producer.send({
        topic: 's3tokafka',
        messages: [{ value: JSON.stringify(campanha) }]
      })
      //console.log('>>>>>>>', JSON.stringify(campanha))
    }
  }
  //yield
}

const run = async () => {
  initKafka()
  await pipelineAsync(
    download,
    csv({
      separator: ';'
    }),
    transform,
  )
  await stopKafka()
  console.log(`Total rows ${records} FileSize ${(fileLength / (1024 * 1024)).toFixed(1)} MB`,)
}

run();
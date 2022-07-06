import fs from "fs";
import sharp from "sharp";

export const deleteImage = (path?: string) => {
  if(!path) return

  const completePath = `${path}`
  
  fs.access(completePath, (err) => {
    if (!err) {
      fs.unlink(completePath, (err) => {
        if (err) console.error(err);
      });
    }
  });
};

export const compressImage = (file: any) => {
  // Pegamos o PATH antigo e fazemos um tratamento com ele, para mudar a extensão do arquivo.
  const newPath = file.path.split(".")[0] + ".webp";

  return (
    sharp(file.path) // Executamos o SHARP na imagem que queremos comprimir
      // .resize(size) //Redimensionamos para o tamanho (se não receber esse parâmetro, não redimensiona
      .toFormat("webp") // Forçamos a conversão esse arquivo para webp
      .webp({
        // Comprimimos, setando uma qualidade
        quality: 10,
      })
      .toBuffer() // Transformamos esse arquivo em um Buffer
      .then((data) => {
        // Deletando o arquivo antigo
        // O fs.acess serve para testar se o arquivo realmente existe, evitando bugs
        fs.access(file.path, (err) => {
          // Um erro significa que a o arquivo não existe, então não tentamos apagar
          if (!err) {
            //Se não houve erros, tentamos apagar
            fs.unlink(file.path, (err) => {
              // Não quero que erros aqui parem todo o sistema, então só vou imprimir o erro, sem throw.
              if (err) console.error(err);
            });
          }
        });

        //Agora vamos armazenar esse buffer no novo caminho
        fs.writeFile(newPath, data, (err) => {
          if (err) {
            // Já aqui um erro significa que o upload falhou, então é importante que o usuário saiba.
            throw err;
          }
        });

        const path = `${process.env.ENV_IMAGE_DIRECTORY?.replace('/', '\\')}\\`

        // Se o código chegou até aqui, deu tudo certo, então vamos retornar o novo caminho
        return newPath.replace(path, '');
      })
  );
};

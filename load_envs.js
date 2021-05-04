// importamos la función writeFile del file system
const fs = require('fs');

const targetPath = './src/environments/environment.ts';

require('dotenv').config();


const envConfigFile = `export const environment = {
   apiUrl: "${process.env.API_URL}",
   ibmApiUrl: "${process.env.IBM_API_URL}",
   socketUrl: "${process.env.SOCKET_URL}",
};
`;

fs.writeFile(targetPath, envConfigFile, function (err) {
   if (err) {
       throw console.error(err);
   } else {
       console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
   }
});
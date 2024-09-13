import { generateKeyPair as generateRsaKeyPair } from "./rsa"


const generateUUIDStringForCrypt = (size: number) => {
    let stringArray: string[] = []
    for (let i = 0; i < size; i++) {
        stringArray.push(crypto.randomUUID())
    }
    return stringArray
}

const stringList = generateUUIDStringForCrypt(100)


// rsa 10240
const main = async () => {
    const { publicKey, privateKey } = await generateRsaKeyPair();
    
}


main()
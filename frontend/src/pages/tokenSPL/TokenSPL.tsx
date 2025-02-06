import {
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddressSync,
  getMintLen,
  LENGTH_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TYPE_SIZE,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { ChangeEvent, useState } from "react";

export default function TokenSPL() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [image, setImage] = useState("");
  const [supply, setSupply] = useState("");
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  async function handleClick() {
    console.log(name, symbol, image, supply);

    const mintKeypair = Keypair.generate(); //create the address of mint account address on which the token will be available
    //wallet.publicKey is the address of the wallet that will pay the transaction fees and will be the mintauthority
    if (wallet.publicKey) {
      const metadata = {
        mint: mintKeypair.publicKey,
        name: name,
        symbol: symbol,
        uri: image,
        additionalMetadata: [],
      };
      const mintLen = getMintLen([ExtensionType.MetadataPointer]); //get the length of the mint account
      const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length; //get the length of the metadata to add to the space that is required for the mint account
      const lamports = await connection.getMinimumBalanceForRentExemption(
        mintLen + metadataLen
      ); //convert the length of the mint account and the metadata to lamports
      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          lamports,
          space: mintLen,
          programId: TOKEN_2022_PROGRAM_ID,
        }), //create the account
        createInitializeMetadataPointerInstruction(
          mintKeypair.publicKey,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        ), //create the metadata pointer
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          9,
          wallet.publicKey,
          null,
          TOKEN_2022_PROGRAM_ID
        ), //create the mint account
        createInitializeInstruction({
          programId: TOKEN_2022_PROGRAM_ID,
          mint: mintKeypair.publicKey,
          metadata: mintKeypair.publicKey,
          name: metadata.name,
          symbol: metadata.symbol,
          uri: metadata.uri,
          mintAuthority: wallet.publicKey,
          updateAuthority: wallet.publicKey,
        })
      );

      transaction.feePayer = wallet.publicKey;
      //assigning the individual that will sign the transaction
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;
      //attaching recent blockhash to the transaction
      transaction.partialSign(mintKeypair);
      //sign the transaction using dapp
      await wallet.sendTransaction(transaction, connection);
      console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
      //mintKeypair.publicKey needs to be passed and stored
      const ata = getAssociatedTokenAddressSync(
        mintKeypair.publicKey,
        wallet.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
      ); //generate an ata address for the wallet
      console.log(`ATA will be created at ${ata.toBase58()}`);

      const tx = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          ata,
          wallet.publicKey,
          mintKeypair.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      ); //transaction that has the instrucution to create an ata acccount for the token
      await wallet.sendTransaction(tx, connection);
      console.log(`Associated Token Account created at ${ata.toBase58()}`);
      //trsaction to mint the token to the ata account
      const mintAmount = LAMPORTS_PER_SOL * parseInt(supply);
      const tx2 = new Transaction().add(
        createMintToInstruction(
          mintKeypair.publicKey,
          ata,
          wallet.publicKey,
          mintAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );

      await wallet.sendTransaction(tx2, connection);
      console.log(`Minted 100 tokens to ${ata.toBase58()}`);
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana SPL Token Launch</h1>
      <input
        className="inputText"
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleChange(setName)}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
        value={symbol}
        onChange={handleChange(setSymbol)}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={handleChange(setImage)}
      />
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Initial Supply"
        value={supply}
        onChange={handleChange(setSupply)}
      />
      <br />
      <button className="btn" onClick={handleClick}>
        Create Token
      </button>
    </div>
  );
}

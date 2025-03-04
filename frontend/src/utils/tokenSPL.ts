import {
  createBurnInstruction,
  createTransferInstruction,
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
  createSetAuthorityInstruction,
} from "@solana/spl-token";
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { AuthorityType } from "@solana/spl-token";
export async function createToken(
  connection: Connection,
  authority: PublicKey,
  name: string,
  symbol: string,
  uri: string
) {
  const mintKeypair = Keypair.generate();

  const metadata = {
    mint: mintKeypair.publicKey,
    name,
    symbol,
    uri,
    additionalMetadata: [],
  };

  const mintLen = getMintLen([ExtensionType.MetadataPointer]);
  const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
  const lamports = await connection.getMinimumBalanceForRentExemption(
    mintLen + metadataLen
  );

  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: authority,
      newAccountPubkey: mintKeypair.publicKey,
      lamports,
      space: mintLen,
      programId: TOKEN_2022_PROGRAM_ID,
    }),
    createInitializeMetadataPointerInstruction(
      mintKeypair.publicKey,
      authority,
      mintKeypair.publicKey,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeMintInstruction(
      mintKeypair.publicKey,
      9,
      authority,
      null,
      TOKEN_2022_PROGRAM_ID
    ),
    createInitializeInstruction({
      programId: TOKEN_2022_PROGRAM_ID,
      mint: mintKeypair.publicKey,
      metadata: mintKeypair.publicKey,
      name: metadata.name,
      symbol: metadata.symbol,
      uri: metadata.uri,
      mintAuthority: authority,
      updateAuthority: authority,
    })
  );

  return { mintKeypair, transaction };
}

export async function mintToAddress(
  connection: Connection,
  mint: PublicKey,
  authority: PublicKey,
  recipient: PublicKey,
  amount: number
) {
  const ata = getAssociatedTokenAddressSync(
    mint,
    recipient,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(ata);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        authority,
        ata,
        recipient,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  const mintAmount = LAMPORTS_PER_SOL * amount;
  tx.add(
    createMintToInstruction(
      mint,
      ata,
      authority,
      mintAmount,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  return tx;
}

export async function transferTokens(
  connection: Connection,
  mint: PublicKey,
  from: PublicKey,
  fromAuthority: PublicKey,
  to: PublicKey,
  amount: number
) {
  const fromATA = getAssociatedTokenAddressSync(
    mint,
    from,
    false,
    TOKEN_2022_PROGRAM_ID
  );
  const toATA = getAssociatedTokenAddressSync(
    mint,
    to,
    false,
    TOKEN_2022_PROGRAM_ID
  );

  const tx = new Transaction();

  const ataInfo = await connection.getAccountInfo(toATA);
  if (!ataInfo) {
    tx.add(
      createAssociatedTokenAccountInstruction(
        fromAuthority,
        toATA,
        to,
        mint,
        TOKEN_2022_PROGRAM_ID
      )
    );
  }

  const transferAmount = amount * LAMPORTS_PER_SOL;
  tx.add(
    createTransferInstruction(
      fromATA,
      toATA,
      fromAuthority,
      transferAmount,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  return tx;
}

export async function burnTokens(
  connection: Connection,
  mint: PublicKey,
  account: PublicKey,
  authority: PublicKey,
  amount: number
) {
  if (!connection) {
    console.log("Connection not established!");
  }
  const tx = new Transaction();
  const burnAmount = amount * LAMPORTS_PER_SOL;

  tx.add(
    createBurnInstruction(
      account,
      mint,
      authority,
      burnAmount,
      [],
      TOKEN_2022_PROGRAM_ID
    )
  );

  return tx;
}

export function createAuthorityTransaction(
  mintAddress: PublicKey,
  currentAuthority: PublicKey,
  newAuthority: PublicKey | null,
  authorityType: AuthorityType
): Transaction {
  const instruction = createSetAuthorityInstruction(
    mintAddress,
    currentAuthority,
    authorityType,
    newAuthority,
    [],
    TOKEN_2022_PROGRAM_ID
  );
  return new Transaction().add(instruction);
}

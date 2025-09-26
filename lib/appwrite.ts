import {Account, Avatars, Client, TablesDB, ID, Query} from "react-native-appwrite";
import {CreateUserParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.afrivault.foododering",
    databaseId: '68d1bdb0002926707097',
    userTableId: '68d52103000c2bf9992d'
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)


export const account = new Account(client);
export const tables = new TablesDB(client);
export const avatars = new Avatars(client);

export const createUser = async ({ email, password, name} : CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await tables.createRow(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            ID.unique(),
            {email, name, accountId:newAccount.$id, avatar:avatarUrl}
        );
    } catch (e){
        throw new Error(e as string);
    }
}

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession({ email, password });
    } catch (e) {
        throw new Error ( e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount =  await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await tables.listRows(
            appwriteConfig.databaseId,
            appwriteConfig.userTableId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.rows[0]
    } catch (e) {
        console.log(e);
        throw new Error (e as string);
    }
}
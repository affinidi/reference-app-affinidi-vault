import { hostUrl } from "../variables";

const getUserInfo = async () => {
  try{
    const response =  await fetch(`${hostUrl}/api/auth/get-user-info`, {method: "GET"});
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Unable to get user info. Are you authenticated?");
    }
    return {data, error:null};

  }catch(error){
    return {data:null, error};
  }

};

export const getAuthInfo = async () => {
  const { data, error } = await getUserInfo();

  if(error){
    return {
      isLoading: false,
      isAuthenticated: false,
      userId: null,
      user: null,
    };
  }

  return {
    isLoading: false,
    isAuthenticated: true,
    userId: data?.userId,
    user: data?.user,
  };
}

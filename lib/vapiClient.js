import Vapi from "@vapi-ai/web";

let vapiInstance = null;

export const getVapiClient = () => {
  if (!vapiInstance) {
    vapiInstance = new Vapi(process.env.VAPI_PUBLIC_KEY);
  }
  return vapiInstance;
};

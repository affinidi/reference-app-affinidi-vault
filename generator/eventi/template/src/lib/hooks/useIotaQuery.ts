import { IotaRequestType } from "src/types/types";
import { iotaFlowTypeRedirect } from "src/lib/variables";
import useIotaQueryWebsocket from "src/lib/hooks/useIotaQueryWebsocket";
import useIotaQueryRedirect from "src/lib/hooks/useIotaQueryRedirect";

export default function useIotaQuery(params: IotaRequestType) {
  if (iotaFlowTypeRedirect) {
    return useIotaQueryRedirect(params)
  } else {
    return useIotaQueryWebsocket(params)
  }
}

import { useQuery } from "blitz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null, { staleTime: Infinity })
  return user
}

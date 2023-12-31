import type { PageServerLoad } from "./login/$types";

export const load: PageServerLoad = async ({cookies, params}) => {
    // Check cookie and return user object
    const cookie = cookies.get('user')!;
    if (cookie == null) {
        return {
            user: null,
        }
    }
    const user = JSON.parse(cookie);
    return {
        user: user,
    };
}
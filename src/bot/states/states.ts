// import { state } from "src/types";
// import redis from "./redis.ts";

// class StateManager {
//     private static redisClient = redis;

//     public static async set(id: number, state: state) {
//         await this.redisClient.set(`state${id.toString()}`, JSON.stringify(state));
//     }

//     public static async get(id: number) : Promise<state | null> {
//         const state = await this.redisClient.get(`state${id.toString()}`);
//         return state ? JSON.parse(state) : null;
//     }

//     public static async delete(id: number) {
//         return await this.redisClient.del(`state${id.toString()}`);
//     }
// }

// export default StateManager;
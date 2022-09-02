import {UserResolver} from "./User.resolver";
import {Container} from "typedi";

describe('UserResolver', () => {
    let resolver: UserResolver;
    beforeEach(() => {
        resolver = Container.get(UserResolver);
    })
    it('should exist', () => {
        expect(resolver).toBeTruthy();
    });
    describe('UserResolver.users', () => {


        it('should list users', async () => {
            const response = await resolver.list(null, {} as any);
            expect(response).toBeTruthy();
        });

    });
})
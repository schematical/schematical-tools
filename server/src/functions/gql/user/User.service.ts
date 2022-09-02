import 'reflect-metadata';
import { Inject, Service} from "typedi";
import {User} from "./User.entity";
import {UserSignupWizardInput} from './User.types';
import {BaseService} from "../../../libs/Base.service";

@Service('UserService')
export class UserService extends BaseService(User){
    @Inject('UserModel')
    private userModel;
    @Inject('CropSpeciesPlacementModel')
    private cropSpeciesPlacementModel;
    constructor(
    ) {
        super();
    }

    async signUpWizard(input: UserSignupWizardInput) {
        const user = await this.userModel.create({
            email: input.email,
            // defaultGeoLocation: input.defaultGeoLocation
        });


        return user;
    }
}
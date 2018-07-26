import { Web3Service } from "../services/web3.service";
import { AbstractControl } from "@angular/forms";

export class EthereumAddressValidator {
    static isEthereumAddress(web3: Web3Service) {
        return (control: AbstractControl) => {
            let isAddress = web3.getWeb3().utils.isAddress(control.value);
            return !isAddress ? { 'invalidAddress': { value: control.value } } : null;
        }
    }
}
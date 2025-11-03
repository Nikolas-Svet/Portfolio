class Validation {
    public async checkEmail(email: string): Promise<boolean> {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }
    public async checkIsPostcodeMessgae(answer: any) {
        let postalCode;
        if (Number(answer)) {
            return  null
        }
        try {
            const obj = JSON.parse(answer);
            postalCode = obj.postal_code + `, ${obj.city}, ${obj.state}`;
        } catch {
            postalCode = null;
        }

        return postalCode;
    }
}

export default Validation
export default class WhatsappSession{
   constructor(){
    this.sessions = new Map()
   }
    getSession(phoneNumber){
        if(!this.sessions.has(phoneNumber)){
            this.sessions.set(phoneNumber,{step:0})
        }
        return this.sessions.get(phoneNumber)
    };
    updateSession(phoneNumber,data){
        const current = this.getSession(phoneNumber);
        this.sessions.set(phoneNumber,{...current,...data})
    }
    deleteSession(phoneNumber){
        this.sessions.delete(phoneNumber)
    }

}
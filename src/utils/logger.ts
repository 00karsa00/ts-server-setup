export class Logger {

    constructor() {
    }

    public log(item: any){
        let { format , ...rest  } = item;
        // time = time? time : new Date().toISOString();
        const formatkey =  Object.keys(format);
        let printLog = ''
        for(let i of formatkey) {
            printLog += `${i ?  item[i] ? item[i] : '' : ''} `;
        }
        printLog += `${JSON.stringify(rest)}`;
        // const printLog = `[${time}] - [${type} - ${file}] :${JSON.stringify({message, rest})}`;
        this.logInFile(printLog);
        console.log(printLog);
    }

    private logInFile(data: string) {
        // 
        return false
    }
}
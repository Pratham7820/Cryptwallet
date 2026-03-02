export default function Home(){
    return(
        <div>

        </div>
    )
}

function Card({tokenSym,tokenName,pubKey,balance}){
    return(
        <div>
            <div>
                {tokenSym}
                <p>{tokenName}</p>
            </div>
            <div>
                Address:{pubKey}
            </div>
            <div>
                Balance:{balance}
            </div>
        </div>
    )
}
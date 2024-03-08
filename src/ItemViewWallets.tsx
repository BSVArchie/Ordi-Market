import { Card, CardContent, Typography } from "@mui/material"
import { useEffect, useState } from "react"


interface ItemProps {
    item: any
    idx: number
    onList: (inx: number, priceSats: number) => void
}

const ItemViewWallet: React.FC<ItemProps> = (
    {
        item, idx, onList
    }
) => {

    const [textData, setTextData] = useState<string | null>(null)

    useEffect(() => {
        if (item.origin.data.insc.file.type === 'text/plain') {
            const url = `https://testnet.ordinals.gorillapool.io/contet/${item.origin.outpoint}`
            fetch(url).then(response => response.text()).then(data => setTextData(data))
            .catch(error => console.error(error))
        }
    }, [item])

    return (
        <Card style={{width: 350, height: 400, margin: 2}}>
            <CardContent>
                {
                    item.origin.data.insc.file.type.startsWith('image') && (
                        <img style={{maxWidth: 250}} src={`https://testnet.ordinals.gorillapool.io/contet/${item.origin.outpoint}`} alt={`Content #${item.origin.num}`} />
                    )
                }
                {
                    item.origin.data.insc.file.type === 'text/plian' && (
                        <Typography variant='h5' component='div'>
                            {textData || 'Loding text...'}
                        </Typography>
                    )
                }
            </CardContent>
        </Card>
    )
}

export default ItemViewWallet

import { useState, useEffect } from 'react';
import { SortListDndKit, SortItemDndKit } from '@/common/components/elementDrag/index';
import styles from './index.module.scss'

type dataType = {
    id: string
    title: string
  }
export default () => {
    const [list, setList] = useState<dataType[]>([])
    const [name, setName] = useState<string>('')
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setTimeout(() => {
            const data = new Array(30).fill('标题-').map((s,i) => (
                {id: 'id-' + i, title: s + i}
            ))
            setList(data)
        }, 200);
    }

    const onDragEnd = (list: dataType[], ids: string[]) => {
        console.log(list,ids,'拖拽')
        setList(list)
    }

    const click = (info) => {
        setName(info.title)
    }

    return (
        <>
            <SortListDndKit list={list} onDragEnd={onDragEnd} onClick={click}>
                {list.map((item, index) => (
                    <div key={index} className={styles.dragItem}>
                        <SortItemDndKit key={item.id} id={item.id}>
                            <div className={styles.item} onClick={() => console.log('22')}>
                                {item.title}
                            </div>
                        </SortItemDndKit>
                    </div>
                ))}
            </SortListDndKit>
            <div>{name}</div>
        </>
    )
}
  
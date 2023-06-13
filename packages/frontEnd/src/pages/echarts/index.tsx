import { useEffect, useRef } from "react";
import RelayRef from "@/common/hocs/logProps/indexTwo";
import { Button, DatePicker, Select, TimePicker } from "antd";
import internationalization from '@/common/hooks/useTranslationEnum';
import { css } from '@emotion/css'
import styles from './flexBox.module.scss';

const Test = () => {
  let refProps = useRef<any>('')
  let refPropsT = useRef<any>('')
  const { RangePicker } = DatePicker;

  const imageUrl = [
    "@/assets/imgs/tx.jpg",
    "@/assets/imgs/tx2.jpg",
    "@/assets/imgs/tx3.jpg",
    "@/assets/imgs/tx4.jpg",
    "@/assets/imgs/tx.jpg",
  ]
  const callback = async (name, age?) => {
    try {
      const result: any = await back(name, age);
      console.log(result.name,'result')
    } catch (error) {
      console.log(error,'error')
    }
    // back(name, age).then(res => {
    //   console.log(res,'success')
    // }).catch(err => {
    //   console.error(err,'error')
    // })
  }

  const back = (name?, age?) => {
    let data = {
      name: name + '2023',
      age: age && age++
    }
    return new Promise((resolve, reject) => {
      if(data?.name && data?.age) {
        resolve(data)
      }else {
        reject(data)
      }
    })
  }

  const imgUrl = (url) => {
    return css`
      background-image: url(${url}) !important;
    `
  }

  useEffect(() => {
    
  },[])

  return(
    <>
      <div
        className={styles.flexs}
      >
        {
          imageUrl.map(() => {
            return (
              <div></div>
            )
          })
        }
      </div>
    </>
  )
}

export default Test;

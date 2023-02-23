import * as React from 'react';
import { useEffect } from 'react';
import {logProps} from '.'
class FancyButton extends React.Component<any> {
  focus() {
    // ...
    console.log(this.props,'focus')
  }
  render() {
    return <>{this.props.label}</>;
  }
}
// const NewFancyButton = (props) => {
//   const focus = () => {
//     console.log('focus', props)
//   }
//   useEffect(() => {
//     console.log('focus',props)
//   },[])

//   return (
//     <>{props.label}</>
//   )
// }

export default logProps(FancyButton)
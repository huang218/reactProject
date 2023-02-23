import * as React from 'react';

// export default (Comp) => {
//   return forwardRef((props: any, ref: any) => {
//     return( 
//       <Comp {...props} ref={ref.bind(this)} />
//     )
//   })
// }
export function logProps(WrappedComponent) {
  class LogPropsF extends React.Component<any> {
    render() {
      const {forWardRef, ...prop} = this.props;
      return <WrappedComponent {...prop} ref={forWardRef} />;
    }
  }
  return React.forwardRef((props: any, ref) => {
    return (
      <LogPropsF {...props} forWardRef={ref}></LogPropsF>
    )
  })
}
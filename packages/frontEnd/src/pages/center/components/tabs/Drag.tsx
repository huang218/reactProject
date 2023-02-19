

import * as React from "react";
import { useEffect } from "react";
import { useSortable } from '@dnd-kit/sortable';
import { useNavigate } from "react-router-dom";
import { CSS } from '@dnd-kit/utilities';
import { css } from '@emotion/css';

interface DraggableTabPaneProps extends React.HTMLAttributes<HTMLDivElement> {
    'data-node-key': string;
    forwardedRef: any;
    nodes: any;
    onActiveBarTransform: (className: string) => void;
}

// const WrappedComponent = React.forwardRef((props, ref) => {
//     return <DraggableTabNode {...props} forwardedRef={ref} />;
// });

const DraggableTabNode = ({ nodes, className, onActiveBarTransform, ...props }: DraggableTabPaneProps) => {
    const abc = useSortable({
        id: nodes.key,
        data: { // 自定义参数，需要的数据放这里
            name: 'hjh',
            age: '18'
        },
    });
    const navigate = useNavigate();

    const style: React.CSSProperties = {
        ...props.style,
        transform: CSS.Transform.toString(abc.transform),
        transition: abc.transform,
        cursor: 'move',
    };

    useEffect(() => {
        if (!abc.isSorting) {
            console.log(props.children,'点击',nodes)
            onActiveBarTransform('');
        }else if (className?.includes('ant-tabs-tab-active')) {
            console.log('拖动')
            // console.log(className, 'style',)
            onActiveBarTransform(
                css`
                .ant-tabs-ink-bar {
                    transform: ${CSS.Transform.toString(abc.transform)};
                    transition: ${abc.transition} !important;
                }
                `,
            );
        }
        // className, abc.isSorting, abc.transform
    }, [ abc.isSorting]);

    return React.cloneElement(props.children as React.ReactElement, {
        ref: abc.setNodeRef,
        style,
        ...abc.attributes,
        ...abc.listeners,
    });
};

export default DraggableTabNode;
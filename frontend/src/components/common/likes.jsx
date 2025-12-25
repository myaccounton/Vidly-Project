import React from 'react';

const Like = (props) => {
    let classes = props.liked ? "fa fa-heart text-danger" : "fa fa-heart-o";

    return (
        <i 
            onClick={props.onClick}
            className={classes}
            style={{ cursor: "pointer" }}
        ></i>
    );
};

export default Like;

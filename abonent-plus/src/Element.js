import React from "react";

class Element extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleElementChange(event.target.value, this.props.cell);
    }

    render() {
        const style = {
            width: 'calc(50px + 20vmin)',
            margin: '10px',
            background: '#282c34',
            border: '0',
            outline: '0',
            color: 'white',
            fontSize: 'calc(5px + 2vmin)',
            textAlign: 'center',
        };
        return (<input onChange={this.handleChange} type="text" spellCheck="false" style={style} defaultValue={this.props.value} />)
    }
}

export default Element
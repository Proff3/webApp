import React from "react";
class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isDeleted: false }
        this.handleElementChange = this.handleElementChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeRow = this.handleChangeRow.bind(this);
    }
    handleChangeRow(e) {
        this.props.handleChangeRow(this.props.rowNum);
    }

    handleElementChange(value, key) {
        this.props.handleChangeRow(value, key, this.props.idx);
    }

    handleDelete() {
        this.props.handleDelete(this.props.idx);
        this.setState(prevState => ({ isDeleted: !prevState.isDeleted }))
    }

    render() {

        let data = [];
        for (let [key, value] of Object.entries(this.props.item)) {
            data.push({ key, value });
        }
        return <tr>{data.map((item, idx) => {
            let value = item.key.includes("DATE") && item.value !== null ? item.value.slice(0, 10) : item.value;
            return idx === 0 ? <th style={{ "cursor": "pointer" }} key={idx} onClick={this.handleChangeRow}>{value}</th> : <td style={{ "cursor": "pointer" }} key={idx} onClick={this.handleChangeRow}>{`${value}`}</td>
        })}</tr>
    }
}

export default Row;
import React from "react";
class THead extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isDeleted: false }
        this.handleElementChange = this.handleElementChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSortingColors = this.handleSortingColors.bind(this);
    }

    handleSortingColors(e) {
        if (e.target.classList.contains("has-background-primary")) {
            e.target.classList.toggle("has-background-primary");
            e.target.classList.toggle("has-background-warning");
        } else if (e.target.classList.contains("has-background-warning")) {
            e.target.classList.toggle("has-background-warning");
        } else {
            let theads = document.querySelectorAll("#THead");
            theads.forEach(thead => thead.classList.remove("has-background-primary", "has-background-warning"));
            e.target.classList.toggle("has-background-primary");
        }
        this.props.handleSorting(e);
    }

    handleElementChange(value, key) {
        this.props.handleChangeRow(value, key, this.props.idx);
    }

    handleDelete() {
        this.props.handleDelete(this.props.idx);
        this.setState(prevState => ({ isDeleted: !prevState.isDeleted }))
    }

    render() {
        let titles = this.props.titles;
        return titles.map((item, idx) => <th title={item} key={idx} onClick={this.handleSortingColors} style={{ "cursor": "pointer" }} id={"THead"}>{item}</th>)
    }
}
export default THead;
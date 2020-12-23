import React from "react";

class ModalField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foreignKeys: [],
            isLoading: true,
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        let value = e.target.value === `null` || e.target.value === `` ? undefined : e.target.value;
        e.target.classList.remove("is-danger")
        this.props.handleChange(this.props.idx, value);
    }

    componentDidMount() {
        if (this.props.title.includes("CD") && this.props.idx !== 0) {
            let table = this.props.title.slice(0, -2).toLowerCase();
            if (table === "account") table = "abonent";
            if (table === "failure") table = "disrepair";
            fetch(`http://localhost:5000/changeRow/${table}`, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
            })
                .then(res => res.json())
                .then(result => {
                    let foreignKeys = [];
                    result.recordset.forEach(row => foreignKeys.push(Object.values(row)[0]));
                    this.setState({ foreignKeys, isLoading: false });
                })
                .then(() => {
                    if (this.state.foreignKeys[0] !== undefined && this.props.value === null) this.props.handleChange(this.props.idx, this.state.foreignKeys[0]);
                })
                .catch(err => console.log(err));
        }
    }

    render() {
        let value = this.props.title.includes("DATE") && this.props.value !== null ? this.props.value.slice(0, 10) : this.props.value;
        if (this.props.title.includes("CD") && this.props.idx !== 0) {
            let foreignKeys = this.state.foreignKeys;
            return (
                <div class="field">
                    <label class="label" style={{ "textAlign": "left" }}>{this.props.title}</label>
                    <div class="control">
                        <div class="select" style={{ "width": "100%" }}>
                            <select id={this.props.title} style={{ "width": "100%" }} value={value} onChange={this.handleChange}>
                                {foreignKeys.map(key => {
                                    return <option value={key} key={key}>{key}</option>
                                })}
                                {this.props.table !== "nachislSumma" && this.props.table !== "paySumma" ? <option value={null}>null</option> : null}
                            </select>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div class="field">
                <label class="label" style={{ "textAlign": "left" }}>{this.props.title}</label>
                <div class="control">
                    <input
                        class="input"
                        type={
                            value === 'number' || this.props.idx === 0 ? "number" :
                                this.props.title.includes("DATE") ? "date" : "text"
                        }
                        placeholder="Введите значение"
                        defaultValue={value}
                        onChange={this.handleChange}
                        id={this.props.title}
                    />
                </div>
            </div>
        )
    }
}

export default ModalField
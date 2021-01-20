import React from "react";
import ModalField from './ModalField'

function getTitle(table) {
    switch (table) {
        case "abonent":
            return "абонента";
        case "executor":
            return "исполнителя";
        case "disrepair":
            return "неисправности";
        case "street":
            return "улицы";
        case "service":
            return "услуги";
        case "nachislSumma":
            return "начисления";
        case "paySumma":
            return "оплаты";
        case "request":
            return "заявки";
        default:
            return "строки"
    }
}

class addingRowTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { changingRow: [] };
        this.handleChange = this.handleChange.bind(this);
        this.handleAdding = this.handleAdding.bind(this);
    }

    componentDidMount() {
        let changingRow = [];
        this.props.keys.forEach(key => changingRow.push({ key, value: null }))
        this.setState({ changingRow });
    }

    handleChange(idx, value) {
        let changingRow = this.state.changingRow;
        changingRow[idx].value = typeof changingRow[idx].value === 'number' ? +value : value;
        this.setState({ changingRow });
        console.log(this.state.changingRow);
    }

    handleAdding(e) {
        let changingRow = this.state.changingRow;
        console.log(changingRow)
        if (!!this.props.primaryKeys.filter(item => `${item}` === `${changingRow[0].value}`).length) {
            alert("Вы ввели существующий первичный ключ!");
            return;
        }
        if (changingRow[0].value === null) {
            alert("Введите первичный ключ!");
            return;
        }
        if (this.props.table === "request" && changingRow[6].value === null) {
            alert("Установите значение в поле EXECUTED!");
            document.getElementById("EXECUTED").classList.toggle("is-danger");
            return;
        }
        e.target.classList.toggle("is-loading");
        let enviroment = this;
        let body = Object.assign({}, { changingRow, login: localStorage.getItem('login') });
        fetch(`http://localhost:5000/add/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        }).then((res) => {
            console.log(res);
            if (res.status === 200) {
                e.target.classList.toggle("is-loading");
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            } else {
                e.target.classList.toggle("is-loading");
                return res.json();
            };
        }).then(errMes => {
            console.log(errMes.originalError.info.message);
            if (errMes) {
                alert(`Введено некорректное значение! Ошибка: ${errMes.originalError.info.message}`);
            };
        }).catch(err => console.dir(err));
    }

    render() {
        let title = getTitle(this.props.table);
        let changingRow = this.state.changingRow;
        return (
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Окно добавления {title}</p>
                        <button class="delete" aria-label="close" onClick={this.props.handleClosingModal}></button>
                    </header>
                    <section class="modal-card-body">
                        {changingRow.map((element, idx) =>
                            <ModalField
                                table={this.props.table}
                                handleChange={this.handleChange}
                                key={element.key} idx={idx}
                                title={element.key}
                                value={element.value}
                                action={"add"}>
                            </ModalField>)}
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={this.handleAdding}>Добавить запись</button>
                        <button class="button" onClick={this.props.handleClosingModal}>Отмена</button>
                    </footer>
                </div>
            </div>
        )
    }
}

export default addingRowTable
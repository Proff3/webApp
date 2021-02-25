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

class changingValuesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { changingRow: [], pkField: null };
        this.handleChange = this.handleChange.bind(this);
        this.handleUpdating = this.handleUpdating.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCommitTransaction = this.handleCommitTransaction.bind(this);
    }

    componentDidMount() {
        let changingRow = [];
        for (let [key, value] of Object.entries(this.props.rows[this.props.numRowChanging])) {
            changingRow.push({ key, value });
        };
        let pkField = changingRow[0].value;
        this.setState({ changingRow, pkField });
        let body = Object.assign({}, { changingRow, pkField, login: localStorage.getItem('login') });
        fetch(`/fakeUpdate/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        }).catch(err => console.log(err))
    }

    handleChange(idx, value) {
        let changingRow = this.state.changingRow;
        changingRow[idx].value = typeof changingRow[idx].value === 'number' ? +value : value;
        this.setState({ changingRow });
    }

    handleDelete(e) {
        e.target.classList.toggle("is-loading");
        let enviroment = this;
        let pkField = { key: this.state.changingRow[0].key, value: this.state.pkField };
        fetch(`/delete/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(Object.assign({}, { pkField, login: localStorage.getItem('login') })),
        }).then((res) => {
            if (res.status === 200) {
                e.target.classList.toggle("is-loading");
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            } else {
                e.target.classList.toggle("is-loading");
                alert("Ошибка удаления!");
            }
        })
    }

    handleCommitTransaction(e) {
        let login = { login: localStorage.getItem('login') };
        fetch(`/transaction/commit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(login)
        }).then(() => this.props.handleClosingModal()).catch(err => console.log(err))
    }

    handleUpdating(e) {
        let changingRow = this.state.changingRow;
        if (!!this.props.primaryKeys.filter(item => `${item}` === `${changingRow[0].value}`).length && changingRow[0].value !== this.state.pkField) {
            alert("Вы ввели существующий первичный ключ!");
            return;
        }
        e.target.classList.toggle("is-loading");
        let enviroment = this;
        let pkField = { key: changingRow[0].key, value: this.state.pkField };
        let body = Object.assign({}, { changingRow, pkField, login: localStorage.getItem('login') });
        fetch(`/change/${this.props.table}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(body),
        }).then((res) => {
            if (res.status === 200) {
                e.target.classList.toggle("is-loading");
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            } else {
                e.target.classList.toggle("is-loading");
                return res.json(); //throwing err message
            };
        }).then(err => {
            if (err.mes === "В данный момент таблица редактируется!") {
                alert(err.mes);
                enviroment.props.updateTable();
                enviroment.props.handleClosingModal();
            }
            else {
                alert(`Некорректное значение поля: ${err.key}`);
                document.getElementById(err.key).classList.toggle("is-danger").focus();
            }
        }).catch(err => console.log(err));
    }

    render() {
        let title = getTitle(this.props.table);
        let changingRow = this.state.changingRow;
        return (
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Окно редактирования {title}</p>
                        <button class="delete" aria-label="close" onClick={this.props.handleClosingModal}></button>
                    </header>
                    <section class="modal-card-body">
                        {changingRow.map((element, idx) =>
                            <ModalField
                                table={this.props.table}
                                handleChange={this.handleChange}
                                key={element.key} idx={idx}
                                title={element.key}
                                value={element.value}>
                            </ModalField>)}
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button is-success" onClick={this.handleUpdating}>Сохранить изменения</button>
                        <button class="button is-danger" onClick={this.handleDelete}>Удалить запись</button>
                        <button class="button" onClick={this.props.handleClosingModal}>Отмена</button>
                    </footer>
                </div>
            </div>
        )
    }
}

export default changingValuesTable
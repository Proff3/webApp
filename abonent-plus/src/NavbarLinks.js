import { Link, NavLink } from "react-router-dom";

function handleClick(props, table) {
    document.querySelector(".navbar-dropdown").style.display = "none";
    props.changeTable(table);
}

function NavbarLinks(props) {
    const navLinkStyle = { color: "#00D1B2", textDecoration: "underline" }
    return (
        <div class="navbar-start">
            <NavLink className="navbar-item" to="/table/abonent" activeStyle={navLinkStyle} onClick={() => props.changeTable("abonent")}>Абоненты</NavLink>
            <NavLink className="navbar-item" to="/table/executor" activeStyle={navLinkStyle} onClick={() => props.changeTable("executor")}>Исполнители</NavLink>
            <NavLink className="navbar-item" to="/table/disrepair" activeStyle={navLinkStyle} onClick={() => props.changeTable("disrepair")}>Неисправности</NavLink>
            <NavLink className="navbar-item" to="/table/street" activeStyle={navLinkStyle} onClick={() => props.changeTable("street")}>Улицы</NavLink>
            <NavLink className="navbar-item" to="/table/services" activeStyle={navLinkStyle} onClick={() => props.changeTable("service")}>Услуги</NavLink>
            <NavLink className="navbar-item" to="/table/nachislSumma" activeStyle={navLinkStyle} onClick={() => props.changeTable("nachislSumma")}>Начисления</NavLink>
            <NavLink className="navbar-item" to="/table/paySumma" activeStyle={navLinkStyle} onClick={() => props.changeTable("paySumma")}>Оплаты</NavLink>
            <NavLink className="navbar-item" to="/table/request" activeStyle={navLinkStyle} onClick={() => props.changeTable("request")}>Заявки</NavLink>
        </div>
    )
}
export default NavbarLinks;
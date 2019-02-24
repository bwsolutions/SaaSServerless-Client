import * as React from 'react';
import Cell from './Cell';
// import EventHandler from '@shopify/polaris';
import './DataTable.css';
import {Debug} from "../_helpers";
var logit = new Debug("DataTable");

/******
 * headings     - entries for table heading row
 * rows         - data entries for table
 * title        - caption (title) for table
 */
export default class DataTable extends React.Component {

    constructor(props) {
        logit.resetPrefix("constructor");
        super(props);

        this.state = {
            cellHeights: [],
        };

        this.tableRef = React.createRef();
    }

    setTable = (table) => {
        this.table = table;
    }

    componentDidMount() {
        this.handleCellHeightResize();
    }

    renderHeadingRow = (_cell, cellIndex) => {
        const {headings} = this.props;
        const {cellHeights} = this.state;

        return (
            <Cell
                key={`heading-${cellIndex}`}
                content={headings[cellIndex]}
                header={true}
                fixed={cellIndex === 0}
                height={cellHeights[0]}
            />
        );
    };

    renderRow = (_row, rowIndex) => {
        const {rows} = this.props;
        const {cellHeights} = this.state;
        const heightIndex = rowIndex + 1;

        return (
            <tr key={`row-${rowIndex}`}>
                {rows[rowIndex].map((_cell, cellIndex) => {
                    return (
                        <Cell
                            key={`${rowIndex}-${cellIndex}`}
                            content={rows[rowIndex][cellIndex]}
                            fixed={cellIndex === 0}
                            height={cellHeights[heightIndex]}
                        />
                    )
                })}
            </tr>
        )
    };


    getTallestCellHeights = () => {
        const rows = Array.from(this.tableRef.current.getElementsByTagName('tr'));
        let {cellHeights} = this.state;

        (cellHeights = rows.map((row) => {
            const fixedCell = (row.childNodes)[0];
            return Math.max(row.clientHeight, fixedCell.clientHeight);
        }));

        return cellHeights;
    }

    handleCellHeightResize = () => {
        this.setState({cellHeights: this.getTallestCellHeights()});
    }

    render() {
        logit.resetPrefix("render");
        const {headings, rows, title} = this.props;
        this.renderHeadingRow = this.renderHeadingRow.bind(this);
        this.renderRow = this.renderRow.bind(this);

        const theadMarkup = (
            <tr key="heading">
                {headings.map(this.renderHeadingRow)}
            </tr>
        );

        const tbodyMarkup = rows.map(this.renderRow);

        return (
            <div className="DataTable">
                <div className="ScrollContainer">
                    <table className="Table" ref={this.tableRef}>
                        <caption>{title}</caption>
                        <thead>{theadMarkup}</thead>
                        <tbody>{tbodyMarkup}</tbody>
                    </table>
                </div>
            </div>
        );
    }
}
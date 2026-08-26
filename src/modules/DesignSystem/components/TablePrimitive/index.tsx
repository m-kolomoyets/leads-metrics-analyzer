import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { Specimen } from '../Specimen';

// Figures chosen to expose a misaligned column: the digits differ in width, so a cell that lost
// `tabular-nums` shows it immediately rather than on one unlucky report.
const ROWS = [
    { geo: 'Germany', leads: 1284, spend: '$4,182.10', cpl: '$3.26' },
    { geo: 'France', leads: 917, spend: '$2,908.44', cpl: '$3.17' },
    { geo: 'Italy', leads: 41, spend: '$188.90', cpl: '$4.61' },
] as const;

function TablePrimitive() {
    return (
        <>
            <Specimen label="Table — default density, total row">
                <Table className="min-w-96">
                    <TableCaption>Leads by geo — the caption sits under the table.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Geo</TableHead>
                            <TableHead isNumeric={true}>Leads</TableHead>
                            <TableHead isNumeric={true}>Spend⁺</TableHead>
                            <TableHead isNumeric={true}>CPL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ROWS.map((row) => {
                            return (
                                <TableRow key={row.geo}>
                                    <TableCell>{row.geo}</TableCell>
                                    <TableCell isNumeric={true}>{row.leads}</TableCell>
                                    <TableCell isNumeric={true}>{row.spend}</TableCell>
                                    <TableCell isNumeric={true}>{row.cpl}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Total</TableCell>
                            <TableCell isNumeric={true}>2 242</TableCell>
                            <TableCell isNumeric={true}>$7,279.44</TableCell>
                            <TableCell isNumeric={true}>$3.25</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Specimen>

            <Specimen label="Table — compact density, sticky header, selected row. Scroll it.">
                <Table density="compact" containerClassName="max-h-40 min-w-96">
                    <TableHeader isSticky={true}>
                        <TableRow>
                            <TableHead>Geo</TableHead>
                            <TableHead isNumeric={true}>Leads</TableHead>
                            <TableHead isNumeric={true}>CPL</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...ROWS, ...ROWS, ...ROWS].map((row, index) => {
                            return (
                                <TableRow key={`${row.geo}-${index}`} data-state={index === 1 ? 'selected' : undefined}>
                                    <TableCell>{row.geo}</TableCell>
                                    <TableCell isNumeric={true}>{row.leads}</TableCell>
                                    <TableCell isNumeric={true}>{row.cpl}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Specimen>
        </>
    );
}

export { TablePrimitive };

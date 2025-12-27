import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
    return (
        <TableOperations>
            <Filter filterField="discount" options={[
                {value: "all", label: "All"}, 
                {value: "no-discount", label: "No discount"}, 
                {value: "with-discount", label: "With discount"}]}/>

            <SortBy options={[
                {value: "name-asc", label: "Sort By name (A-Z)"},
                {value: "name-desc", label: "Sort By name (Z-A)"},
                {value: "regularPrice-asc", label: "Price: (Low first)"},
                {value: "regularPrice-desc", label: "Price: (High first)"},
                {value: "maxCapacity-asc", label: "Max Capacity: (Low first)"},
                {value: "maxCapacity-desc", label: "Max Capacity: (High first)"}
            ]}/>
        </TableOperations>
    )
}

export default CabinTableOperations;
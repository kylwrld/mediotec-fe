import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function StudentControllerClassTeacher({ table }) {
    return (
        <div className="flex justify-between items-center flex-wrap gap-2 py-4 ">
            <div className="flex gap-2">
                <Input
                    placeholder="Filtrar nome..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm text-[10px] md:text-sm"
                />
                <Select
                    onValueChange={(value) => {
                        table.getColumn("degree")?.setFilterValue(value);
                    }}>
                    <SelectTrigger className="w-[180px] text-muted-foreground text-[10px] md:text-sm">
                        <SelectValue placeholder="Filtrar ano" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                </Select>

                <Button
                    className="text-[10px] md:text-sm bg-orange-600"
                    onClick={(event) => {
                        table.resetColumnFilters();
                    }}>
                    Remover filtros
                </Button>
            </div>
        </div>
    );
}

export default StudentControllerClassTeacher;

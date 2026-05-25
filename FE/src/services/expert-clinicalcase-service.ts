import { ApiClient2 } from "@/src/utils/api-client";
import { CompleteClinicalCaseSchema } from "@/src/types/clinicalcase";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const getPaginatedClinicalCases = async (search: string, status: string, type: string, eccid: string, sortBy: string, sortDir: string, page: number, pageSize: number): Promise<CompleteClinicalCaseSchema[]> => {
    const params = { page, pageSize, search, status, type, eccid, sortBy, sortDir };
    const res = await ApiClient2.get('/clinical-case/api/expert/clinical-cases', { params });

    const data = res.data.items as CompleteClinicalCaseSchema[];

    return data;
};

export const getClinicalCaseDetails = async (caseId: string): Promise<CompleteClinicalCaseSchema> => {
    const res = await ApiClient2.get(`/clinical-case/api/expert/clinical-cases/${caseId}`);
    return res.data as CompleteClinicalCaseSchema;
}

export const exportClinicalCasesToExcel =
async (
    cases: CompleteClinicalCaseSchema[]
) => {

    const workbook =
        new ExcelJS.Workbook();

    const sheet =
        workbook.addWorksheet(
            "Clinical Cases"
        );

    sheet.columns = [
        {
            header: "Case ID",
            key: "caseId",
            width: 18,
        },
        {
            header: "Title",
            key: "title",
            width: 35,
        },
        {
            header: "Type",
            key: "caseType",
            width: 20,
        },
        {
            header: "Status",
            key: "status",
            width: 16,
        },
        {
            header: "ECC ID",
            key: "eccId",
            width: 18,
        },
        {
            header: "Attempts",
            key: "attemptCount",
            width: 12,
        },
        {
            header: "Avg Score",
            key: "avgScore",
            width: 12,
        },
        {
            header: "Created At",
            key: "createdAt",
            width: 24,
        },
    ];

    cases.forEach((c) => {

        sheet.addRow({
            caseId:
                c.caseId,

            title:
                c.title,

            caseType:
                c.caseType,

            status:
                c.status,

            eccId:
                c.eccId,

            attemptCount:
                c.attemptCount ?? 0,

            avgScore:
                c.avgScore ?? 0,

            createdAt:
                new Date(
                    c.createdAt
                ).toLocaleString(),
        });

    });

    sheet.getRow(1).font = {
        bold: true,
    };

    const buffer =
        await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        `clinical-cases-${Date.now()}.xlsx`
    );
};
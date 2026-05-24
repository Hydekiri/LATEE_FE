import { clientApi } from "@/src/utils/api-client";
import type {
    ClinicalCaseSummary,
    ClinicalCaseDetail,
    ClinicalCaseListParams,
    PaginatedResponse,
    CreateClinicalCaseRequest,
    CreateClinicalCaseResponse,
    UpdateClinicalCaseRequest,
    UpdateClinicalCaseResponse,
    UpdateCaseStatusRequest,
    UpdateStatusResponse,
    DeleteClinicalCaseResponse,
    DuplicateClinicalCaseResponse,
    UpdateLabValueRequest,
    UpdateLabResponse,
    UpdateRadiologyTextRequest,
    UpdateRadiologyResponse,
} from "@/src/types/clinical-case";
import { buildQueryString } from "@/src/utils/api-client";


const BASE = "/clinical-case/api/expert/clinical-cases";

export const clinicalCaseService = {

    // API-1: GET /clinical-case/api/expert/clinical-cases
    async list(params: ClinicalCaseListParams = {}): Promise<PaginatedResponse<ClinicalCaseSummary>> {
        const qs = buildQueryString({
            page:     params.page     ?? 1,
            pageSize: params.pageSize ?? 12,
            search:   params.search   ?? "",
            status:   params.status   ?? "",
            type:     params.type     ?? "",
            eccid:    params.eccid    ?? "",
            sortBy:   params.sortBy   ?? "",
            sortDir:  params.sortDir  ?? "",
        });
        return clientApi.get<PaginatedResponse<ClinicalCaseSummary>>(`${BASE}${qs}`);
    },

    // API-2: GET /clinical-case/api/expert/clinical-cases/{id}
    async getById(id: string): Promise<ClinicalCaseDetail> {
        const qs = buildQueryString({ id });
        const res = await clientApi.get<{ items: ClinicalCaseDetail[] }>(`${BASE}${qs}`);
        const item = res.items?.[0];
        if (!item) throw new Error(`Case ${id} not found`);
        return item;
    },

    // API-3: POST /clinical-case/api/expert/clinical-cases
    async create(payload: CreateClinicalCaseRequest): Promise<CreateClinicalCaseResponse> {
        return clientApi.post<CreateClinicalCaseResponse, CreateClinicalCaseRequest>(
            BASE,
            payload
        );
    },

    // API-4: PUT /clinical-case/api/expert/clinical-cases/{id}
    async update(id: string, payload: UpdateClinicalCaseRequest): Promise<UpdateClinicalCaseResponse> {
        return clientApi.put<UpdateClinicalCaseResponse, UpdateClinicalCaseRequest>(
            `${BASE}/${id}`,
            payload
        );
    },

    // API-5: PATCH /clinical-case/api/expert/clinical-cases/{id}/status
    async updateStatus(id: string, status: UpdateCaseStatusRequest["status"]): Promise<UpdateStatusResponse> {
        return clientApi.patch<UpdateStatusResponse, UpdateCaseStatusRequest>(
            `${BASE}/${id}/status`,
            { status }
        );
    },

    // API-6: DELETE /clinical-case/api/expert/clinical-cases/{id}
    async delete(id: string): Promise<DeleteClinicalCaseResponse> {
        return clientApi.delete<DeleteClinicalCaseResponse>(`${BASE}/${id}`);
    },

    // API-7: POST /clinical-case/api/expert/clinical-cases/{id}/duplicate
    async duplicate(id: string): Promise<DuplicateClinicalCaseResponse> {
        return clientApi.post<DuplicateClinicalCaseResponse, Record<string, never>>(
            `${BASE}/${id}/duplicate`,
            {}
        );
    },

    // API-8: PATCH /clinical-case/api/expert/clinical-cases/{id}/labs/{labId}
    async updateLab(caseId: string, labId: number, value: string): Promise<UpdateLabResponse> {
        return clientApi.patch<UpdateLabResponse, UpdateLabValueRequest>(
            `${BASE}/${caseId}/labs/${labId}`,
            { value }
        );
    },

    // API-9: PATCH /clinical-case/api/expert/clinical-cases/{id}/radiology/{radId}
    async updateRadiology(caseId: string, radId: number, text: string): Promise<UpdateRadiologyResponse> {
        return clientApi.patch<UpdateRadiologyResponse, UpdateRadiologyTextRequest>(
            `${BASE}/${caseId}/radiology/${radId}`,
            { text }
        );
    },
};
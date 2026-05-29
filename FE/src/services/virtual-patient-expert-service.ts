import { clientApi, buildQueryString } from "@/src/utils/api-client";
import type {
    VirtualPatientSummary,
    VirtualPatientDetail,
    VPListParams,
    VPPaginatedResponse,
    CreateVPRequest,
    CreateVPResponse,
    UpdateVPRequest,
    UpdateVPResponse,
    UpdateVPStatusRequest,
    UpdateVPStatusResponse,
    UpdateVPExpertsRequest,
    UpdateVPExpertsResponse,
    DeleteVPResponse,
    DuplicateVPResponse,
    VPStatus,
    ExpertSearchResult,
    ClinicalCaseSummary,
} from "@/src/types/virtual-patient-expert";

const BASE = "/api/expert/virtual-patients";
const EXPERT_BASE = "/api/experts";
const CASE_BASE = "/api/expert/clinical-cases";

export const virtualPatientExpertService = {

    list(params: VPListParams = {}): Promise<VPPaginatedResponse<VirtualPatientSummary>> {
        const qs = buildQueryString({
            page: params.page ?? 1,
            pageSize: params.pageSize ?? 15,
            search: params.search ?? "",
            status: params.status ?? "",
            level: params.level ?? "",
            gender: params.gender ?? "",
            caseId: params.caseId ?? "",
            sortBy: params.sortBy ?? "",
            sortDir: params.sortDir ?? "",
        });
        return clientApi.get<VPPaginatedResponse<VirtualPatientSummary>>(`${BASE}${qs}`);
    },

    getById(id: string): Promise<VirtualPatientDetail> {
        return clientApi.get<VirtualPatientDetail>(`${BASE}/${id}`);
    },

    create(payload: CreateVPRequest): Promise<CreateVPResponse> {
        return clientApi.post<CreateVPResponse, CreateVPRequest>(BASE, payload);
    },

    update(id: string, payload: UpdateVPRequest): Promise<UpdateVPResponse> {
        return clientApi.put<UpdateVPResponse, UpdateVPRequest>(`${BASE}/${id}`, payload);
    },

    updateStatus(id: string, status: VPStatus): Promise<UpdateVPStatusResponse> {
        return clientApi.patch<UpdateVPStatusResponse, UpdateVPStatusRequest>(
            `${BASE}/${id}/status`,
            { status }
        );
    },

    delete(id: string): Promise<DeleteVPResponse> {
        return clientApi.delete<DeleteVPResponse>(`${BASE}/${id}?confirm=true`);
    },

    duplicate(id: string): Promise<DuplicateVPResponse> {
        return clientApi.post<DuplicateVPResponse, Record<string, never>>(
            `${BASE}/${id}/duplicate`,
            {}
        );
    },

    publish(id: string): Promise<UpdateVPStatusResponse> {
        return clientApi.patch<UpdateVPStatusResponse, Record<string, never>>(
            `${BASE}/${id}/publish`,
            {}
        );
    },

    addExperts(vpId: string, expertIds: string[]): Promise<UpdateVPExpertsResponse> {
        const payload: UpdateVPExpertsRequest = { expertIds };
        return clientApi.post<UpdateVPExpertsResponse, UpdateVPExpertsRequest>(
            `${BASE}/${vpId}/experts`,
            payload
        );
    },

    replaceExperts(vpId: string, expertIds: string[]): Promise<UpdateVPExpertsResponse> {
        const payload: UpdateVPExpertsRequest = { expertIds };
        return clientApi.put<UpdateVPExpertsResponse, UpdateVPExpertsRequest>(
            `${BASE}/${vpId}/experts`,
            payload
        );
    },

    removeExpert(vpId: string, expertId: string): Promise<UpdateVPExpertsResponse> {
        return clientApi.delete<UpdateVPExpertsResponse>(
            `${BASE}/${vpId}/experts/${expertId}`
        );
    },


    searchExperts(keyword: string): Promise<ExpertSearchResult[]> {
        if (!keyword.trim()) {
            return clientApi.get<ExpertSearchResult[]>(EXPERT_BASE);
        }
        const qs = buildQueryString({ keyword: keyword.trim() });
        return clientApi.get<ExpertSearchResult[]>(`${EXPERT_BASE}/search${qs}`);
    },

    searchClinicalCases(
        query: string,
        pageSize: number = 10,
    ): Promise<VPPaginatedResponse<ClinicalCaseSummary>> {
        const qs = buildQueryString({
            search: query.trim(),
            pageSize,
            page: 1,
        });
        return clientApi.get<VPPaginatedResponse<ClinicalCaseSummary>>(`${CASE_BASE}${qs}`);
    },
};
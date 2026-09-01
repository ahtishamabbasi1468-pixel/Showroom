import { createSlice } from "@reduxjs/toolkit";
import { makeCrudThunks, attachCrudReducers } from "../../firebase/crudThunks";
import { COLLECTIONS } from "../../firebase/collections";

const services = makeCrudThunks("services", COLLECTIONS.SERVICES);
const packages = makeCrudThunks("packages", COLLECTIONS.PACKAGES);

export const fetchServices = services.fetchAllThunk;
export const addService = services.addThunk;
export const updateService = services.updateThunk;
export const deleteService = services.removeThunk;

export const fetchPackages = packages.fetchAllThunk;
export const addPackage = packages.addThunk;
export const updatePackage = packages.updateThunk;
export const deletePackage = packages.removeThunk;

const servicesSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    packages: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    attachCrudReducers(builder, services, "services");
    attachCrudReducers(builder, packages, "packages");
  },
});

export default servicesSlice.reducer;

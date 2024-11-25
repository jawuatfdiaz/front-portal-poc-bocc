export const themeMock = JSON.stringify({
  id: "davivienda",
  properties: {
    logo: "../assets/images/davivienda-logo.png",
    themeUrl: "../themes/davivienda.css",
    removeField: ["country"],
    removeFields: ["subCategories", "technologies", "deployOrchestor"],
    deployOrchestor: false,
    localLogin: false,
    auth: {
      postLogoutRedirectUri: "http://localhost:4200",
    },
    dataFilters: {
      categories: [
        {
          name: "Area Usuaria 1",
          code: "area_usuaria_1",
          description: "",
          subItems: [],
        },
        {
          name: "Area Usuaria 2",
          code: "area_usuaria_2",
          description: "",
          subItems: [],
        },
        {
          name: "Area Usuaria 3",
          code: "area_usuaria_3",
          description: "",
          subItems: [],
        },
      ],
      country: [
        { name: "filial 1", code: "filial_1" },
        { name: "filial 2", code: "filial_2" },
        { name: "filial 3", code: "filial_3" },
        { name: "filial 4", code: "filial_4" },
      ],
      cloudProvider: [{ name: "Azure", code: "AZURE" }],
    },
  },
});

import { formatFileSize, formatIntervalDuration }from "./formatters";

describe("formatFileSize", () => {
  it("should throw with non-number arhument", () => {
    expect(() => {
      formatFileSize({} as any);
    }).toThrow("Argument: size is not a number");
    expect(() => {
      formatFileSize("test" as any);
    }).toThrow("Argument: size is not a number");
  });

  it("should format to three digits", () => {
    expect(formatFileSize(125950)).toEqual("123 KБ");
    expect(formatFileSize(12897280)).toEqual("12,3 МБ");
    expect(formatFileSize(1320681472)).toEqual("1,23 ГБ");

    expect(formatFileSize(1000 * 1024 * 1024)).toEqual("0,98 ГБ");
    expect(formatFileSize(1014 * 1024 * 1024)).toEqual("0,99 ГБ");
  });

  it("should format precisely before 1000 bytes", () => {
    expect(formatFileSize(0)).toEqual("0 Б");
    expect(formatFileSize(9)).toEqual("9 Б");
    expect(formatFileSize(99)).toEqual("99 Б");
    expect(formatFileSize(999)).toEqual("999 Б");
  });

  it("should format precisely after 1000 exabytes", () => {
    const exabyte = Math.pow(2, 60);

    expect(formatFileSize(1000 * exabyte)).toEqual("1000 ЭБ");
    expect(formatFileSize(1024 * exabyte)).toEqual("1024 ЭБ");
    expect(formatFileSize(12345 * exabyte)).toEqual("12345 ЭБ");
  });
});

describe("formatIntervalDuration", () => {
  it("should format duration", () => {
    let duration = formatIntervalDuration(
      new Date(2014, 8 /*сентябрь*/, 17, 18, 0),
      new Date(2017, 2 /*март*/, 10, 17, 59)
    );

    expect(duration).toBe("2 года 5 мес. 20 дн. 23 ч. 59 м.");
  });

  it("should format year suffix", () => {
    let oneYear = formatIntervalDuration(new Date(2016, 0, 1), new Date(2017, 0, 1));
    let threeYears = formatIntervalDuration(new Date(2016, 0, 1), new Date(2019, 0, 1));
    let sevenYears = formatIntervalDuration(new Date(2016, 0, 1), new Date(2023, 0, 1));
    let twelveYears = formatIntervalDuration(new Date(2016, 0, 1), new Date(2028, 0, 1));

    expect(oneYear).toBe("1 год");
    expect(threeYears).toBe("3 года");
    expect(sevenYears).toBe("7 лет");
    expect(twelveYears).toBe("12 лет");
  });

  it("should work with leap years", () => {
    let normalDuration = formatIntervalDuration(new Date(2016, 2 /*март*/, 1), new Date(2017, 2 /*март*/, 1));

    let leapDuration = formatIntervalDuration(new Date(2016, 1 /*февраль*/, 29), new Date(2017, 2 /*март*/, 1));

    expect(normalDuration).toBe("1 год");
    expect(leapDuration).toBe("1 год");
  });
});

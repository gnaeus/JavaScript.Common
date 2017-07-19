import { observable, computed } from "knockout-decorators";

export const Attributes = {
  Required: "data-val-required",
  MinLength: "data-val-min-length",
  MaxLength: "data-val-max-length",
  StringLength: "data-val-string-length",
  InvalidSymbol: "data-val-invalid-symbol",
  UnsupportedSymbol: "data-val-unsupported-symbol",
  IncorrectPhone: "data-val-incorrect-phone",
  NotFound: "data-val-not-found",
  NumbersRepeated: "data-val-numbers-repeated"
};

export class Validator {
  /** 
   * Находится ли соответствующее <input> в фокусе
   * Присваивание this.HasFocus = true / false вручную НЕ ставит <input> в фокус!
   */
  @observable HasFocus = false;
  /**
   * Был ли изменен соответствующее <input>
   */
  @observable WasChanged = false;
  /**
   * Произвольное сообщение об ошибке. Задается вручную: this.CustomError = "Ошибка"
   * Очищается, когда соответствующее <input> получает фокус
   * Имеет приоритет перед сообщениями, заполняемыми из "data-val-" аттрибутов
   */
  @observable CustomError = "";
  /**
   * Результирующее сообщение об ошибке, которое отображается в DOM
   */
  @computed
  get Error() {
    return this.CustomError || this._getValidationError();
  }
  /**
   * Является ли соответствующее свойство модели данных валидным
   */
  @computed
  get IsValid() {
    return !this.Error;
  }

  /**
   * Словарь с сообщениями об ошибках, заполняемый из "data-val-" аттрибутов
   */
  private _attributeMessages: { [key: string]: string } = Object.create(null);
  /**
   * Результирующая функция получения сообщения об ошибке валидации
   */
  private _getValidationError: () => string = null;

  /**
   * Инициализарует валидатор с помощью функции получения строки ошибки
   */
  constructor(getValidationError: () => string);

  /**
   * Инициализарует валидатор с помощью пары (условие валидации, имя соответствующее атрибута ошибки)
   */
  constructor(condition: () => boolean, attributeName: string);

  /**
   * Инициализарует валидатор с помощью списка пар (условие валидации, имя соответствующее атрибута ошибки)
   */
  constructor(
    conditionFirst: () => boolean,
    attributeNameFirst: string,
    conditionSecond: () => boolean,
    attributeNameSecond: string
  );

  /**
   * Инициализарует валидатор с помощью списка пар (условие валидации, имя соответствующее атрибута ошибки)
   */
  constructor(...args: ((() => boolean) | string)[]);

  constructor() {
    switch (arguments.length) {
      case 1: {
        this._getValidationError = arguments[0];
        break;
      }
      case 2: {
        let condition = arguments[0];
        let attributeName = arguments[1];
        this._getValidationError = () => {
          if (!condition()) {
            return this.messageFor(attributeName);
          }
        };
        break;
      }
      default: {
        let args = toArray(arguments);
        this._getValidationError = () => {
          for (let i = 0; i < args.length; i += 2) {
            let condition = args[i];
            let attributeName = args[i + 1];
            if (!condition()) {
              return this.messageFor(attributeName);
            }
          }
        };
      }
    }
  }

  /**
   * Получить сообщение заданное с помощью соответствующее "data-val-" аттрибута.
   * Сообщения становятся доступны после выполнения "validator"-биндинга.
   */
  messageFor(attributeName: string) {
    return this._attributeMessages[attributeName] || (new String("") as string);
  }

  /**
   * Сериализуем с помощью JSON.stringify как undefined.
   * Тогда при использовании валидатора в модели, изменения внутреннего состояния валидатора
   * не будут интерпретироваться как изменения глобального состояния модели.
   */
  protected toJSON() {
    return void 0;
  }
}

/**
   * Преобразовать произвольную коллекцию элементов (например NodeList) в Array
   */
const toArray: <T>(items: ArrayLike<T>) => T[] = Function.prototype.call.bind(Array.prototype.slice);

ko.bindingHandlers["validator"] = {
  init(element: Element, valueAccessor) {
    const $container = $(element);
    const $input = $("input, textarea", $container);
    const $message = $("[validation-for]", $container);

    const validator = ko.unwrap(valueAccessor()) as Validator;

    // заполнить словарь сообщений валидатора значениями из "data-val-" аттрибутов
    const attributeMessages = (validator as any)._attributeMessages;

    toArray($message.get(0).attributes).filter(a => a.name.indexOf("data-val-") === 0).forEach(a => {
      attributeMessages[a.name] = a.value;
    });

    $input
      .on("focus", () => {
        validator.HasFocus = true;
      })
      .on("blur", () => {
        validator.HasFocus = false;
      })
      .on("input", () => {
        validator.WasChanged = true;
      })
      .on("keypress", () => {
        validator.WasChanged = true;
      });

    // если в контейнере произошло нажатие мышки на элементе автокомплита
    $container.on("mousedown", "ul li", event => {
      // считаем что поле ввода не потеряло фокус
      $input.one("blur", () => {
        validator.HasFocus = true;
      });
      // пока пользователь не отпустит клавишу мышки
      $(document).one("mouseup", () => {
        validator.HasFocus = false;
      });
    });

    // подождать, пока выплонится binding на <input>
    ko.tasks.schedule(() => {
      // если <input> не пустое
      if ($input.val()) {
        // значит соответствующее значение модели было изменено ранее
        validator.WasChanged = true;
      }
    });

    // расположить сообщение валидации по цнтру под полем ввода
    // $message.css({ "left": "0", "margin-left": "0" });
    // const messageMarginTop = parseInt($message.css("margin-top"));

    // обработчик, который применяет изменения к DOM при изменении состояния валидатора
    ko.computed(
      () => {
        if (!validator.IsValid && !validator.HasFocus && validator.WasChanged) {
          $container.addClass("invalid");
          $message.text(validator.Error);
          $message.show();

          // $container.css({
          //   "margin-bottom": (messageMarginTop + $message.outerHeight()) + "px"
          // });
        } else {
          validator.CustomError = "";

          $container.removeClass("invalid");
          $message.empty();
          $message.hide();

          // $container.css({ "margin-bottom": "" });
        }
      },
      null,
      { disposeWhenNodeIsRemoved: element }
    );
  }
};

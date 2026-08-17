package com.act.audit.shared.domain.model;

import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;

@MappedSuperclass
@Getter
public abstract class AggregateRoot {

    @Version
    private Long version = 0L;

}
